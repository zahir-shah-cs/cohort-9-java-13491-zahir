package com.zahir.contactmanagement.repository;

import com.zahir.contactmanagement.entity.Contact;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ContactRepository extends JpaRepository<Contact, Long> {

    Page<Contact> findByUserId(
            Long userId,
            Pageable pageable
    );

    Page<Contact> findByUserIdAndNameContainingIgnoreCase(
            Long userId,
            String name,
            Pageable pageable
    );

    Optional<Contact> findByIdAndUserId(
            Long contactId,
            Long userId
    );

}