package org.example.phonepaywallet.repository;

import org.example.phonepaywallet.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findBySenderUpiOrReceiverUpiOrderByDateDesc(String senderUpi, String receiverUpi);
    List<Transaction> findBySenderUpiOrderByDateDesc(String senderUpi);
    List<Transaction> findByReceiverUpiOrderByDateDesc(String receiverUpi);
}

