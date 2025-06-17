import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

const ContactForm = () => {
  const form = useRef();
  const [isSending, setIsSending] = useState(false);
  const [sentMessage, setSentMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSending(true);
    setSentMessage('');
    setErrorMessage('');

    emailjs
      .sendForm(
        'YOUR_SERVICE_ID',
        'YOUR_TEMPLATE_ID',
        form.current,
        'YOUR_PUBLIC_KEY'
      )
      .then(
        (result) => {
          console.log(result.text);
          setSentMessage('Your message has been sent. Thank you!');
          setIsSending(false);
          form.current.reset();
        },
        (error) => {
          console.log(error.text);
          setErrorMessage('Failed to send message. Please try again.');
          setIsSending(false);
        }
      );
  };

  return (
    <form
      ref={form}
      onSubmit={sendEmail}
      className="php-email-form"
      data-aos="fade-up"
      data-aos-delay="300"
    >
      <div className="row gy-4">
        <div className="col-md-6">
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Your Name"
            required
          />
        </div>

        <div className="col-md-6">
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Your Email"
            required
          />
        </div>

        <div className="col-md-12">
          <input
            type="text"
            name="subject"
            className="form-control"
            placeholder="Subject"
            required
          />
        </div>

        <div className="col-md-12">
          <textarea
            name="message"
            className="form-control"
            rows="6"
            placeholder="Message"
            required
          ></textarea>
        </div>

        <div className="col-md-12 text-center">
          {isSending && <div className="loading">Sending...</div>}
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {sentMessage && <div className="sent-message">{sentMessage}</div>}

          <button type="submit" disabled={isSending}>
            {isSending ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ContactForm;
