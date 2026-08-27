package com.zahir.contactmanagement.controller;

import com.zahir.contactmanagement.entity.Contact;
import com.zahir.contactmanagement.service.ContactService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    public Contact createContact(@RequestBody Contact contact) {
        return contactService.createPublicContact(contact);
    }
}