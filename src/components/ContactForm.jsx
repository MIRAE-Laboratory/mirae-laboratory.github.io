import React from "react";
import { Form, Button } from "react-bootstrap";
import { formspreeUrl } from "../config";
import { postData } from "../utils";

const ContactForm = () => {
  const [status, setStatus] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const body = Object.fromEntries(data);
    setStatus("Sending...");
    try {
      const res = await postData(formspreeUrl, body);
      setStatus(res.ok ? "Thanks! Message sent." : "Something went wrong.");
    } catch {
      setStatus("Failed to send.");
    }
  };

  return (
    <Form onSubmit={handleSubmit} action={formspreeUrl} method="POST" className="mt-4">
      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" name="email" required />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Message</Form.Label>
        <Form.Control as="textarea" name="message" rows={3} required />
      </Form.Group>
      <Button type="submit" variant="primary">{status || "Send"}</Button>
    </Form>
  );
};

export default ContactForm;
