import React from 'react';

export function StaticPage({ page }) {
  const title = page === 'privacy' ? 'Privacy Policy' : 'Terms and Conditions';
  const text = page === 'privacy'
    ? 'InfinityStore respects your privacy and is committed to protecting your personal information. When you use our platform, we may collect basic details such as your name, email address, contact information, order history, and usage data to improve your shopping experience. This information is used to process orders, provide customer support, enhance website performance, and ensure account security. We do not sell or share your personal data with unauthorized third parties. However, limited information may be shared with trusted partners such as payment gateways for secure transactions and delivery services for order fulfillment. We also use cookies to improve user experience and maintain session data. By using InfinityStore, you agree to the collection and use of your information as described. For any privacy-related concerns, you can contact us to our email.'
    : 'By using InfinityStore, you agree to follow our terms and conditions. You are responsible for maintaining the confidentiality of your account and activities under it. While we aim to provide accurate product information, slight variations in descriptions or images may occur. Orders are confirmed only after successful payment, and InfinityStore reserves the right to cancel orders in cases of fraud, technical issues, or stock unavailability. Delivery times may vary depending on location and courier services. Returns and refunds are accepted only under valid conditions such as damaged or incorrect products, and refunds will be processed through the original payment method. Users must not misuse the platform, attempt unauthorized access, or engage in fraudulent activities. InfinityStore may update these terms at any time without prior notice.';

  return (
    <section className="panel">
      <h1>{title}</h1>
      <p>{text}</p>
    </section>
  );
}
