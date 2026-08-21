package com.zahir.contactmanagement.repository;

import com.zahir.contactmanagement.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactRepository extends JpaRepository<Contact, Long> {
}