package com.example.ecommerce.service;

import com.example.ecommerce.model.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class MailService {
    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    public void sendOrderPlaced(String to, Order order) {
        send(to, "InfinityStore - Order Confirmed",
                "Hi there!\n\nYour order has been placed successfully.\n\n" +
                "Order ID: " + order.getTrackingNumber() + "\n" +
                "Total: Rs. " + String.format("%.2f", order.getTotalPrice()) + "\n" +
                "Payment: " + order.getPaymentMethod() + " (" + order.getPaymentStatus() + ")\n\n" +
                "We'll notify you when it ships.\n\nThank you for shopping with InfinityStore!");
    }

    public void sendPaymentSuccess(String to, Order order) {
        send(to, "InfinityStore - Payment Successful",
                "Hi there!\n\nPayment for your order has been confirmed.\n\n" +
                "Order ID: " + order.getTrackingNumber() + "\n" +
                "Amount Paid: Rs. " + String.format("%.2f", order.getTotalPrice()) + "\n\n" +
                "Thank you for shopping with InfinityStore!");
    }

    public void sendPasswordReset(String to, String token) {
        send(to, "InfinityStore - Password Reset",
                "Hi there!\n\nYou requested a password reset.\n\n" +
                "Your reset code is: " + token + "\n\n" +
                "Enter this code in the app to reset your password.\n" +
                "If you didn't request this, please ignore this email.\n\n" +
                "- InfinityStore Team");
    }

    @Async
    public void send(String to, String subject, String body) {
        if (mailSender == null || to == null || to.isBlank()) {
            System.out.println("Email skipped: mailSender is null or recipient is blank.");
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("InfinityStore <" + fromEmail + ">");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            System.out.println("Email sent successfully to: " + to + " | Subject: " + subject);
        } catch (Exception ex) {
            System.out.println("Email delivery failed to " + to + ": " + ex.getMessage());
            ex.printStackTrace();
        }
    }
}
