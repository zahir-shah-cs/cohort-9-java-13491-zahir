package com.zahir.contactmanagement.controller;

import com.zahir.contactmanagement.entity.Contact;
import com.zahir.contactmanagement.entity.User;
import com.zahir.contactmanagement.service.ContactService;

import com.zahir.contactmanagement.service.UserProfileService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/user-contacts")
public class UserContactController {

    private final ContactService contactService;
    private final UserProfileService userProfileService;
    private static final Logger logger =
            LoggerFactory.getLogger(UserContactController.class);
    public UserContactController(ContactService contactService, UserProfileService userProfileService) {
        this.contactService = contactService;
        this.userProfileService = userProfileService;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<Contact> createContact(
            @RequestBody Contact contact,
            Authentication authentication
    ) {

        User user = (User) authentication.getPrincipal();
        Contact created =
                contactService.createContact(
                        contact,
                        user
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(created);
    }


    // GET ALL + PAGINATION
    @GetMapping
    public ResponseEntity<Page<Contact>> getContacts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String search,

            Authentication authentication
    ) {

        User user = (User) authentication.getPrincipal();

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("id").descending()
        );

        Page<Contact> contacts =
                contactService.getContacts(
                        user,
                        search,
                        pageable
                );

        return ResponseEntity.ok(contacts);
    }


    // GET ONE
    @GetMapping("/{id}")
    public ResponseEntity<Contact> getContact(
            @PathVariable Long id,
            Authentication authentication
    ) {

        User user = (User) authentication.getPrincipal();
        Contact contact =
                contactService.getContact(
                        id,
                        user
                );

        return ResponseEntity.ok(contact);
    }


    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Contact> updateContact(
            @PathVariable Long id,
            @RequestBody Contact contact,
            Authentication authentication
    ) {

        User user = (User) authentication.getPrincipal();
        Contact updated =
                contactService.updateContact(
                        id,
                        contact,
                        user
                );

        return ResponseEntity.ok(updated);
    }


    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(
            @PathVariable Long id,
            Authentication authentication
    ) {

        User user = (User) authentication.getPrincipal();
        contactService.deleteContact(
                id,
                user
        );

        return ResponseEntity.noContent().build();
    }


    // EXPORT CONTACTS
    @GetMapping("/export")
    public ResponseEntity<String> exportContacts(
            Authentication authentication
    ) {

        User user = (User) authentication.getPrincipal();

        String csv = contactService.exportContacts(user);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=contacts.csv"
                )
                .contentType(
                        MediaType.parseMediaType(
                                "text/csv"
                        )
                )
                .body(csv);
    }

    // IMPORT CONTACTS
    @PostMapping(
            value = "/import",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<String> importContacts(
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) throws IOException {

        if (file.isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("Please upload a CSV file.");
        }

        User autUser = (User) authentication.getPrincipal();

        User user = userProfileService.getUserByEmail(autUser.getEmail());

        int importedCount =
                contactService.importContacts(
                        file.getInputStream(),
                        user
                );

        return ResponseEntity.ok(
                importedCount +
                        " contacts imported successfully."
        );
    }
}