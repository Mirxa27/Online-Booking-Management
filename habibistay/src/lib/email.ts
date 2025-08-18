import nodemailer from 'nodemailer'
import { Resend } from 'resend'

// Use Resend if API key is available, otherwise use nodemailer
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// Nodemailer transporter for development/testing
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

interface EmailOptions {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail({ to, subject, html, from }: EmailOptions) {
  const fromEmail = from || process.env.EMAIL_FROM || 'noreply@habibistay.com'
  
  try {
    if (resend) {
      // Use Resend in production
      const data = await resend.emails.send({
        from: fromEmail,
        to,
        subject,
        html
      })
      return { success: true, messageId: data.id }
    } else {
      // Use nodemailer for development
      const info = await transporter.sendMail({
        from: fromEmail,
        to,
        subject,
        html
      })
      return { success: true, messageId: info.messageId }
    }
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, error: (error as Error).message }
  }
}

// Email templates
export const emailTemplates = {
  bookingConfirmation: (booking: any) => ({
    subject: `Booking Confirmed - ${booking.property.title}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2957c3 0%, #1e3a8a 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .btn { display: inline-block; padding: 12px 30px; background: #2957c3; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .check-in-code { background: #e3f2fd; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; font-weight: bold; color: #2957c3; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Confirmed! 🎉</h1>
              <p>Your stay at ${booking.property.title} is confirmed</p>
            </div>
            <div class="content">
              <p>Dear ${booking.guestName || booking.guest.name},</p>
              <p>Thank you for choosing Habibistay! Your booking has been confirmed and we're excited to host you.</p>
              
              <div class="booking-details">
                <h2>Booking Details</h2>
                <div class="detail-row">
                  <strong>Booking ID:</strong>
                  <span>${booking.id}</span>
                </div>
                <div class="detail-row">
                  <strong>Property:</strong>
                  <span>${booking.property.title}</span>
                </div>
                <div class="detail-row">
                  <strong>Address:</strong>
                  <span>${booking.property.address}, ${booking.property.city}</span>
                </div>
                <div class="detail-row">
                  <strong>Check-in:</strong>
                  <span>${new Date(booking.checkIn).toLocaleDateString()}</span>
                </div>
                <div class="detail-row">
                  <strong>Check-out:</strong>
                  <span>${new Date(booking.checkOut).toLocaleDateString()}</span>
                </div>
                <div class="detail-row">
                  <strong>Guests:</strong>
                  <span>${booking.guests}</span>
                </div>
                <div class="detail-row">
                  <strong>Total Amount:</strong>
                  <span>${booking.currency} ${booking.totalPrice}</span>
                </div>
              </div>
              
              <div class="check-in-code">
                Check-in Code: ${booking.checkInCode}
              </div>
              <p style="text-align: center; color: #666;">Please present this code at check-in</p>
              
              <h3>Host Information</h3>
              <p>
                <strong>Host Name:</strong> ${booking.property.host.name}<br>
                <strong>Contact:</strong> ${booking.property.host.email}
              </p>
              
              <h3>Important Information</h3>
              <ul>
                <li>Check-in time: 3:00 PM</li>
                <li>Check-out time: 11:00 AM</li>
                <li>Please bring a valid ID for verification</li>
                <li>Contact the host 24 hours before arrival</li>
              </ul>
              
              <center>
                <a href="${process.env.NEXTAUTH_URL}/booking/${booking.id}" class="btn">View Booking Details</a>
              </center>
              
              <p>If you have any questions, feel free to contact our support team or use Sara, our AI assistant, available 24/7 on our website.</p>
              
              <p>We wish you a wonderful stay!</p>
              <p>Best regards,<br>The Habibistay Team</p>
            </div>
            <div class="footer">
              <p>© 2024 Habibistay. All rights reserved.</p>
              <p>This is an automated email. Please do not reply directly to this message.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }),
  
  welcomeEmail: (user: any) => ({
    subject: 'Welcome to Habibistay! 🏡',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2957c3 0%, #1e3a8a 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .feature { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
            .btn { display: inline-block; padding: 12px 30px; background: #2957c3; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Habibistay!</h1>
              <p>Your journey to amazing stays begins here</p>
            </div>
            <div class="content">
              <p>Hi ${user.name},</p>
              <p>Welcome to Habibistay! We're thrilled to have you join our community of travelers and hosts.</p>
              
              <h2>What you can do with Habibistay:</h2>
              
              <div class="feature">
                <h3>🏠 Find Perfect Stays</h3>
                <p>Browse through hundreds of verified properties in prime locations worldwide.</p>
              </div>
              
              <div class="feature">
                <h3>🤖 Meet Sara, Your AI Assistant</h3>
                <p>Our intelligent chatbot Sara is available 24/7 to help you find properties, make bookings, and answer any questions.</p>
              </div>
              
              <div class="feature">
                <h3>💰 Investment Opportunities</h3>
                <p>Explore investment options with an average 17% annual ROI through our managed property portfolio.</p>
              </div>
              
              <div class="feature">
                <h3>🏆 Become a Host</h3>
                <p>List your property and join our network of successful hosts earning passive income.</p>
              </div>
              
              <center>
                <a href="${process.env.NEXTAUTH_URL}/properties" class="btn">Start Exploring</a>
              </center>
              
              <h3>Need Help?</h3>
              <p>Our support team is here to help you. You can also chat with Sara on our website for instant assistance.</p>
              
              <p>Thank you for choosing Habibistay. We look forward to being part of your travel adventures!</p>
              
              <p>Best regards,<br>The Habibistay Team</p>
            </div>
            <div class="footer">
              <p>© 2024 Habibistay. All rights reserved.</p>
              <p>You received this email because you signed up for Habibistay.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }),
  
  paymentReceipt: (booking: any) => ({
    subject: `Payment Receipt - Booking ${booking.id}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2957c3; color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .receipt { background: white; padding: 20px; border: 1px solid #ddd; margin: 20px 0; }
            .amount-row { display: flex; justify-content: space-between; padding: 8px 0; }
            .total { font-size: 20px; font-weight: bold; color: #2957c3; border-top: 2px solid #2957c3; padding-top: 10px; margin-top: 10px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Payment Receipt</h1>
            </div>
            <div class="content">
              <div class="receipt">
                <h2>Receipt Details</h2>
                <p><strong>Receipt Number:</strong> ${booking.paymentId || booking.id}</p>
                <p><strong>Date:</strong> ${new Date(booking.paidAt).toLocaleDateString()}</p>
                <p><strong>Payment Method:</strong> ${booking.paymentMethod}</p>
                
                <h3>Booking Information</h3>
                <p><strong>Property:</strong> ${booking.property.title}</p>
                <p><strong>Check-in:</strong> ${new Date(booking.checkIn).toLocaleDateString()}</p>
                <p><strong>Check-out:</strong> ${new Date(booking.checkOut).toLocaleDateString()}</p>
                <p><strong>Guests:</strong> ${booking.guests}</p>
                
                <h3>Payment Breakdown</h3>
                <div class="amount-row">
                  <span>Accommodation (${Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24))} nights × ${booking.currency} ${booking.pricePerNight})</span>
                  <span>${booking.currency} ${booking.pricePerNight * Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24))}</span>
                </div>
                ${booking.cleaningFee ? `
                <div class="amount-row">
                  <span>Cleaning Fee</span>
                  <span>${booking.currency} ${booking.cleaningFee}</span>
                </div>
                ` : ''}
                ${booking.serviceFee ? `
                <div class="amount-row">
                  <span>Service Fee</span>
                  <span>${booking.currency} ${booking.serviceFee}</span>
                </div>
                ` : ''}
                <div class="amount-row total">
                  <span>Total Paid</span>
                  <span>${booking.currency} ${booking.totalPrice}</span>
                </div>
              </div>
              
              <p>Thank you for your payment. This receipt confirms your booking has been paid in full.</p>
              
              <p>If you have any questions about this receipt, please contact our support team.</p>
            </div>
            <div class="footer">
              <p>© 2024 Habibistay. All rights reserved.</p>
              <p>This is an official receipt from Habibistay.</p>
            </div>
          </div>
        </body>
      </html>
    `
  })
}