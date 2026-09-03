package com.zahir.contactmanagement.service;

import com.zahir.contactmanagement.exception.ResourceNotFoundException;
import com.zahir.contactmanagement.entity.User;
import com.zahir.contactmanagement.entity.Contact;
import com.zahir.contactmanagement.repository.ContactRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


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


    // =========================
    // EXPORT CONTACTS
    // =========================

    public String exportContacts(User user) {

        logger.info(
                "Exporting contacts. userId={}",
                user.getId()
        );

        List<Contact> contacts =
                contactRepository.findByUserId(user.getId());

        StringBuilder csv = new StringBuilder();

        // CSV header
        csv.append("name,email,phone\n");

        for (Contact contact : contacts) {

            csv.append(escapeCsv(contact.getName()))
                    .append(",")
                    .append(escapeCsv(contact.getEmail()))
                    .append(",")
                    .append(escapeCsv(contact.getPhone()))
                    .append("\n");
        }

        logger.info(
                "Contacts exported successfully. userId={}, count={}",
                user.getId(),
                contacts.size()
        );

        return csv.toString();
    }

    // =========================
    // IMPORT CONTACTS
    // =========================

    public int importContacts(
            InputStream inputStream,
            User user
    ) throws IOException {

        logger.info(
                "Importing contacts. userId={}",
                user.getId()
        );

        int importedCount = 0;

        try (
                BufferedReader reader =
                        new BufferedReader(
                                new InputStreamReader(
                                        inputStream,
                                        StandardCharsets.UTF_8
                                )
                        )
        ) {

            String header = reader.readLine();

            if (header == null) {
                throw new RuntimeException(
                        "CSV file is empty."
                );
            }

            String line;

            while ((line = reader.readLine()) != null) {

                if (line.trim().isEmpty()) {
                    continue;
                }

                String[] values = parseCsvLine(line);

                if (values.length != 3) {
                    throw new RuntimeException(
                            "Invalid CSV format. Expected: name,email,phone"
                    );
                }

                Contact contact = new Contact();

                contact.setName(values[0].trim());
                contact.setEmail(values[1].trim());
                contact.setPhone(values[2].trim());

                // Associate with authenticated user
                contact.setUser(user);

                contactRepository.save(contact);

                importedCount++;
            }
        }

        logger.info(
                "Contacts imported successfully. userId={}, count={}",
                user.getId(),
                importedCount
        );

        return importedCount;
    }

    private String[] parseCsvLine(String line) {

        List<String> values = new ArrayList<>();

        StringBuilder current = new StringBuilder();

        boolean insideQuotes = false;

        for (int i = 0; i < line.length(); i++) {

            char character = line.charAt(i);

            if (character == '"') {

                if (insideQuotes &&
                        i + 1 < line.length() &&
                        line.charAt(i + 1) == '"') {

                    current.append('"');
                    i++;

                } else {

                    insideQuotes = !insideQuotes;
                }

            } else if (
                    character == ',' &&
                            !insideQuotes
            ) {

                values.add(current.toString());
                current.setLength(0);

            } else {

                current.append(character);
            }
        }

        values.add(current.toString());

        return values.toArray(new String[0]);
    }


    private String escapeCsv(String value) {

        if (value == null) {
            return "";
        }

        if (value.contains(",") ||
                value.contains("\"") ||
                value.contains("\n")) {

            return "\"" +
                    value.replace("\"", "\"\"") +
                    "\"";
        }

        return value;
    }

}