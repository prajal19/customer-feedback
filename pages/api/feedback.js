import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { 
      name, 
      email, 
      rating, 
      serviceType, 
      serviceSatisfaction, 
      wouldRecommend, 
      areasToImprove, 
      message 
    } = req.body;

    // Validate required fields
    if (!name || !email || !rating || !message) {
      return res.status(400).json({ message: "Required fields: Name, Email, Rating, and Message are required" });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Format areas to improve as HTML list
    const areasToImproveHTML = areasToImprove && areasToImprove.length > 0 
      ? `<ul>${areasToImprove.map(area => `<li>${area}</li>`).join('')}</ul>`
      : '<p>None selected</p>';

    // Create email HTML content
    const emailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #10b981; border-radius: 10px; background-color: #f0fdf4;">
        <div style="background: linear-gradient(to right, #10b981, #059669); padding: 20px; border-radius: 8px 8px 0 0; color: white; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🌿 New Customer Feedback - Garden Services</h1>
        </div>
        
        <div style="padding: 20px; background-color: white; border-radius: 0 0 8px 8px;">
          <div style="margin-bottom: 20px; padding: 15px; background-color: #f0fdf4; border-radius: 5px; border-left: 4px solid #10b981;">
            <h2 style="color: #047857; margin-top: 0;">Customer Information</h2>
            <p><strong>👤 Name:</strong> ${name}</p>
            <p><strong>📧 Email:</strong> ${email}</p>
            <p><strong>⭐ Rating:</strong> ${'★'.repeat(rating)}${'☆'.repeat(5-rating)} (${rating}/5)</p>
          </div>
          
          <div style="margin-bottom: 20px; padding: 15px; background-color: #f0fdf4; border-radius: 5px; border-left: 4px solid #059669;">
            <h2 style="color: #047857; margin-top: 0;">Service Details</h2>
            <p><strong>🔧 Service Type:</strong> ${serviceType || 'Not specified'}</p>
            <p><strong>😊 Overall Satisfaction:</strong> ${serviceSatisfaction || 'Not specified'}</p>
            <p><strong>👍 Would Recommend:</strong> ${wouldRecommend || 'Not specified'}</p>
          </div>
          
          <div style="margin-bottom: 20px; padding: 15px; background-color: #f0fdf4; border-radius: 5px; border-left: 4px solid #047857;">
            <h2 style="color: #047857; margin-top: 0;">Areas for Improvement</h2>
            ${areasToImproveHTML}
          </div>
          
          <div style="padding: 15px; background-color: #f0fdf4; border-radius: 5px; border-left: 4px solid #065f46;">
            <h2 style="color: #047857; margin-top: 0;">Detailed Feedback</h2>
            <div style="padding: 10px; background-color: white; border-radius: 4px; border: 1px solid #d1fae5;">
              <p style="margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
          
          <div style="margin-top: 20px; padding: 10px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb;">
            <p>Feedback submitted at: ${new Date().toLocaleString()}</p>
            <p>Reply to this customer at: <a href="mailto:${email}" style="color: #10b981;">${email}</a></p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
          <p>🌱 Green Thumb Landscaping Services - Customer Feedback System</p>
        </div>
      </div>
    `;

    // Send email
    await transporter.sendMail({
      from: `"Garden Services Feedback" <${process.env.FROM_EMAIL}>`,
      to: process.env.ENQUIRY_TO_EMAIL,
      replyTo: email,
      subject: `New Feedback: ${name} - ${rating}⭐ Rating`,
      html: emailHTML,
    });

    // Optional: Also send a confirmation email to the customer
    if (process.env.SEND_CONFIRMATION === "true") {
      const customerHTML = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(to right, #10b981, #059669); padding: 20px; border-radius: 8px 8px 0 0; color: white; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🌿 Thank You for Your Feedback!</h1>
          </div>
          
          <div style="padding: 20px; background-color: white; border-radius: 0 0 8px 8px;">
            <p>Dear ${name},</p>
            
            <p>Thank you for taking the time to provide feedback about our gardening services. We truly appreciate your input as it helps us grow and improve.</p>
            
            <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f0fdf4; border-radius: 8px;">
              <div style="font-size: 32px; color: #fbbf24; margin-bottom: 10px;">
                ${'★'.repeat(rating)}${'☆'.repeat(5-rating)}
              </div>
              <p style="font-size: 18px; color: #047857; margin: 0;">
                You rated us: <strong>${rating} out of 5 stars</strong>
              </p>
            </div>
            
            <p>We've received your feedback and our team will review it carefully. If you have any urgent concerns, please don't hesitate to contact us directly.</p>
            
            <p>Best regards,<br>
            <strong>The Garden Services Team</strong></p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
              <p>This is an automated confirmation email. Please do not reply to this message.</p>
            </div>
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: `"Garden Services" <${process.env.FROM_EMAIL}>`,
        to: email,
        subject: "Thank You for Your Feedback - Garden Services",
        html: customerHTML,
      });
    }

    return res.status(200).json({ 
      message: "Feedback submitted successfully! Thank you for helping us improve our services." 
    });
  } catch (error) {
    console.error("Feedback submission error:", error);
    return res.status(500).json({ 
      message: "Failed to submit feedback. Please try again later or contact us directly." 
    });
  }
}