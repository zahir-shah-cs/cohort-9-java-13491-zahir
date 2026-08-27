package com.zahir.contactmanagement.controller;

import com.zahir.contactmanagement.entity.Contact;
import com.zahir.contactmanagement.entity.User;
import com.zahir.contactmanagement.service.ContactService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user-contacts")
public class UserContactController {

    private final ContactService contactService;

    public UserContactController(ContactService contactService) {
        this.contactService = contactService;
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
}