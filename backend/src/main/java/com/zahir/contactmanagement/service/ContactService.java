package com.zahir.contactmanagement.service;

import com.zahir.contactmanagement.exception.ResourceNotFoundException;
import com.zahir.contactmanagement.entity.User;
import com.zahir.contactmanagement.entity.Contact;
import com.zahir.contactmanagement.repository.ContactRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;

@Service
public class ContactService {

    private static final Logger logger = LoggerFactory.getLogger(ContactService.class);
    private final ContactRepository contactRepository;

    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    // =========================
    // PUBLIC CONTACT
    // =========================
    public Contact createPublicContact(Contact contact) {
        contact.setUser(null);

        Contact savedContact = contactRepository.save(contact);
        logger.info(
                "Public contact submitted successfully. contactId={}",
                savedContact.getId()
        );
        return savedContact;
    }

    // =========================
    // AUTHENTICATED USER CRUD
    // =========================

    // CREATE
    public Contact createContact(Contact contact, User user)
    {
        // Associate contact with logged-in user
        contact.setUser(user);
        Contact savedContact =
                contactRepository.save(contact);

        logger.info(
                "Contact created. contactId={}, userId={}",
                savedContact.getId(),
                user.getId()
        );

        return savedContact;
    }

    // GET ALL + SEARCH + PAGINATION
    public Page<Contact> getContacts(
            User user,
            String search,
            Pageable pageable
    ) {

        if (search == null || search.trim().isEmpty()) {

            return contactRepository.findByUserId(
                    user.getId(),
                    pageable
            );
        }

        logger.info(
                "Fetching contacts. userId={}, page={}, size={}, search={}",
                user.getId(),
                pageable.getPageNumber(),
                pageable.getPageSize(),
                search
        );

        return contactRepository
                .findByUserIdAndNameContainingIgnoreCase(
                        user.getId(),
                        search.trim(),
                        pageable
                );
    }

    // GET ONE
    public Contact getContact(
            Long contactId,
            User user
    ) {


        logger.info(
                "Fetching contact. contactId={}, userId={}",
                contactId,
                user.getId()
        );
        return contactRepository
                .findByIdAndUserId(
                        contactId,
                        user.getId()
                )
                .orElseThrow(()  -> {

                    logger.warn(
                            "Contact not found. contactId={}, userId={}",
                            contactId,
                            user.getId()
                    );

                    return new ResourceNotFoundException(
                            "Contact not found"
                    );
                });
    }



    // UPDATE
    public Contact updateContact(
            Long contactId,
            Contact contactData,
            User user
    ) {

        logger.info(
                "Updating contact. contactId={}, userId={}",
                contactId,
                user.getId()
        );

        Contact existingContact =
                contactRepository
                        .findByIdAndUserId(
                                contactId,
                                user.getId()
                        )
                        .orElseThrow(() -> {

                            logger.warn(
                                    "Contact update failed. Contact not found. contactId={}, userId={}",
                                    contactId,
                                    user.getId()
                            );

                            return new ResourceNotFoundException(
                                    "Contact not found"
                            );
                        });

        existingContact.setName(
                contactData.getName()
        );

        existingContact.setEmail(
                contactData.getEmail()
        );

        existingContact.setPhone(
                contactData.getPhone()
        );

        logger.info(
                "Contact updated successfully. contactId={}, userId={}",
                contactId,
                user.getId()
        );

        return contactRepository.save(
                existingContact
        );
    }



    // DELETE
    public void deleteContact(
            Long contactId,
            User user
    ) {

        logger.info(
                "Deleting contact. contactId={}, userId={}",
                contactId,
                user.getId()
        );

        Contact contact =
                contactRepository
                        .findByIdAndUserId(
                                contactId,
                                user.getId()
                        )
                        .orElseThrow(() -> {

                            logger.warn(
                                    "Contact deletion failed. Contact not found. contactId={}, userId={}",
                                    contactId,
                                    user.getId()
                            );

                            return new ResourceNotFoundException(
                                    "Contact not found"
                            );
                        });

        contactRepository.delete(contact);

        logger.info(
                "Contact deleted successfully. contactId={}, userId={}",
                contactId,
                user.getId()
        );
    }

}