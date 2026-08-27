package com.zahir.contactmanagement.service;

import com.zahir.contactmanagement.entity.Contact;
import com.zahir.contactmanagement.entity.User;
import com.zahir.contactmanagement.repository.ContactRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactService {

    private final ContactRepository contactRepository;

    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    // =========================
    // PUBLIC CONTACT
    // =========================
    public Contact createPublicContact(Contact contact) {
        contact.setUser(null);
        return contactRepository.save(contact);
    }

    // =========================
    // AUTHENTICATED USER CRUD
    // =========================

    // CREATE
    public Contact createContact(Contact contact, User user)
    {
        // Associate contact with logged-in user
        contact.setUser(user);
        return contactRepository.save(contact);
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
        return contactRepository
                .findByIdAndUserId(
                        contactId,
                        user.getId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Contact not found"
                        ));
    }



    // UPDATE
    public Contact updateContact(
            Long contactId,
            Contact contactData,
            User user
    ) {

        Contact existingContact =
                contactRepository
                        .findByIdAndUserId(
                                contactId,
                                user.getId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Contact not found"
                                ));

        existingContact.setName(
                contactData.getName()
        );

        existingContact.setEmail(
                contactData.getEmail()
        );

        existingContact.setPhone(
                contactData.getPhone()
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

        Contact contact =
                contactRepository
                        .findByIdAndUserId(
                                contactId,
                                user.getId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Contact not found"
                                ));

        contactRepository.delete(contact);
    }

}