#!/usr/bin/env python3
"""
Portfolio Backend Server
A Flask-based backend server for handling contact form submissions,
analytics, and other portfolio functionality.
"""

import os
import json
import smtplib
import logging
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any, Optional
import re

from flask import Flask, request, jsonify, render_template_string, send_from_directory, send_file
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import sqlite3
import hashlib
import uuid

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('portfolio.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')

# Enable CORS for frontend
CORS(app, origins=['http://localhost:5000', 'https://moeedhassan.dev'])

# Rate limiting
limiter = Limiter(
    key_func=get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://"
)

# Database setup
def init_database():
    """Initialize SQLite database for storing submissions and analytics."""
    conn = sqlite3.connect('portfolio.db')
    cursor = conn.cursor()
    
    # Contact submissions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS contact_submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            submission_id TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            company TEXT,
            project_type TEXT,
            budget TEXT,
            timeline TEXT,
            message TEXT NOT NULL,
            newsletter_signup BOOLEAN DEFAULT FALSE,
            ip_address TEXT,
            user_agent TEXT,
            referrer TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'pending',
            response_sent BOOLEAN DEFAULT FALSE
        )
    ''')
    
    # Analytics table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS analytics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_type TEXT NOT NULL,
            event_data TEXT,
            ip_address TEXT,
            user_agent TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Newsletter subscribers table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS newsletter_subscribers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            name TEXT,
            subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'active',
            unsubscribe_token TEXT UNIQUE
        )
    ''')
    
    conn.commit()
    conn.close()
    logger.info("Database initialized successfully")

# Email configuration
EMAIL_CONFIG = {
    'smtp_server': os.getenv('SMTP_SERVER', 'smtp.gmail.com'),
    'smtp_port': int(os.getenv('SMTP_PORT', '587')),
    'email': os.getenv('EMAIL_ADDRESS', 'moeed@thelegend.dev'),
    'password': os.getenv('EMAIL_PASSWORD', ''),
    'recipient': os.getenv('RECIPIENT_EMAIL', 'moeed@thelegend.dev')
}

def validate_email(email: str) -> bool:
    """Validate email format."""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def sanitize_input(text: str, max_length: int = None) -> str:
    """Sanitize user input."""
    if not text:
        return ""
    
    # Remove HTML tags and scripts
    text = re.sub(r'<[^>]*>', '', text)
    text = re.sub(r'javascript:', '', text, flags=re.IGNORECASE)
    
    # Trim whitespace
    text = text.strip()
    
    # Limit length
    if max_length and len(text) > max_length:
        text = text[:max_length]
    
    return text

def send_notification_email(submission_data: Dict[str, Any]) -> bool:
    """Send notification email for new contact form submission."""
    try:
        if not EMAIL_CONFIG['password']:
            logger.warning("Email password not configured, skipping email notification")
            return False
        
        # Create message
        msg = MIMEMultipart()
        msg['From'] = EMAIL_CONFIG['email']
        msg['To'] = EMAIL_CONFIG['recipient']
        msg['Subject'] = f"New Portfolio Contact: {submission_data['name']}"
        
        # Email body
        body = f"""
        New contact form submission received:
        
        Name: {submission_data['name']}
        Email: {submission_data['email']}
        Company: {submission_data.get('company', 'Not provided')}
        Project Type: {submission_data.get('project_type', 'Not specified')}
        Budget: {submission_data.get('budget', 'Not specified')}
        Timeline: {submission_data.get('timeline', 'Not specified')}
        Newsletter Signup: {'Yes' if submission_data.get('newsletter') else 'No'}
        
        Message:
        {submission_data['message']}
        
        Submitted at: {submission_data['timestamp']}
        IP Address: {submission_data.get('ip_address', 'Unknown')}
        User Agent: {submission_data.get('user_agent', 'Unknown')}
        Referrer: {submission_data.get('referrer', 'Direct')}
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        # Send email
        with smtplib.SMTP(EMAIL_CONFIG['smtp_server'], EMAIL_CONFIG['smtp_port']) as server:
            server.starttls()
            server.login(EMAIL_CONFIG['email'], EMAIL_CONFIG['password'])
            server.send_message(msg)
        
        logger.info(f"Notification email sent for submission from {submission_data['email']}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send notification email: {str(e)}")
        return False

def send_auto_reply(submission_data: Dict[str, Any]) -> bool:
    """Send auto-reply email to the person who submitted the form."""
    try:
        if not EMAIL_CONFIG['password']:
            logger.warning("Email password not configured, skipping auto-reply")
            return False
        
        # Create message
        msg = MIMEMultipart()
        msg['From'] = EMAIL_CONFIG['email']
        msg['To'] = submission_data['email']
        msg['Subject'] = "Thank you for contacting Moeed ul Hassan - The Legend"
        
        # Auto-reply body
        body = f"""
        Dear {submission_data['name']},
        
        Thank you for reaching out! I've received your message and will get back to you within 2 hours.
        
        Here's a summary of what you submitted:
        Project Type: {submission_data.get('project_type', 'Not specified')}
        Budget Range: {submission_data.get('budget', 'Not specified')}
        Timeline: {submission_data.get('timeline', 'Not specified')}
        
        In the meantime, feel free to:
        • Check out my recent projects: https://moeedhassan.dev/#projects
        • Connect with me on LinkedIn: https://linkedin.com/in/moeedhassan
        • Follow my GitHub: https://github.com/moeedhassan
        
        I'm excited to discuss your project and see how I can help bring your ideas to life!
        
        Best regards,
        Moeed ul Hassan
        Python Backend Developer & AI Specialist
        "The Legend"
        
        📧 moeed@thelegend.dev
        🌐 https://moeedhassan.dev
        📍 Gujrat, Pakistan
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        # Send email
        with smtplib.SMTP(EMAIL_CONFIG['smtp_server'], EMAIL_CONFIG['smtp_port']) as server:
            server.starttls()
            server.login(EMAIL_CONFIG['email'], EMAIL_CONFIG['password'])
            server.send_message(msg)
        
        logger.info(f"Auto-reply sent to {submission_data['email']}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send auto-reply: {str(e)}")
        return False

def log_analytics_event(event_type: str, event_data: Dict[str, Any] = None):
    """Log analytics event to database."""
    try:
        conn = sqlite3.connect('portfolio.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO analytics (event_type, event_data, ip_address, user_agent)
            VALUES (?, ?, ?, ?)
        ''', (
            event_type,
            json.dumps(event_data) if event_data else None,
            request.remote_addr,
            request.headers.get('User-Agent', '')
        ))
        
        conn.commit()
        conn.close()
        
    except Exception as e:
        logger.error(f"Failed to log analytics event: {str(e)}")

@app.route('/')
def serve_index():
    """Serve the main portfolio page."""
    return send_file('index.html')

@app.route('/<path:path>')
def serve_static_files(path):
    """Serve static files (CSS, JS, assets)."""
    return send_from_directory('.', path)

@app.route('/health')
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'service': 'Portfolio Backend',
        'version': '1.0.0',
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/api/contact', methods=['POST'])
@limiter.limit("5 per minute")
def handle_contact_form():
    """Handle contact form submissions."""
    try:
        # Get form data
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400
        
        # Validate required fields
        required_fields = ['name', 'email', 'message']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'message': f'{field.title()} is required'
                }), 400
        
        # Validate email format
        if not validate_email(data['email']):
            return jsonify({
                'success': False,
                'message': 'Invalid email address format'
            }), 400
        
        # Sanitize inputs
        submission_data = {
            'submission_id': str(uuid.uuid4()),
            'name': sanitize_input(data['name'], 100),
            'email': sanitize_input(data['email'], 255),
            'company': sanitize_input(data.get('company', ''), 100),
            'project_type': sanitize_input(data.get('projectType', ''), 50),
            'budget': sanitize_input(data.get('budget', ''), 50),
            'timeline': sanitize_input(data.get('timeline', ''), 50),
            'message': sanitize_input(data['message'], 2000),
            'newsletter': bool(data.get('newsletter', False)),
            'timestamp': datetime.utcnow().isoformat(),
            'ip_address': request.remote_addr,
            'user_agent': request.headers.get('User-Agent', ''),
            'referrer': request.headers.get('Referer', '')
        }
        
        # Store in database
        conn = sqlite3.connect('portfolio.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO contact_submissions (
                submission_id, name, email, company, project_type, budget, 
                timeline, message, newsletter_signup, ip_address, user_agent, referrer
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            submission_data['submission_id'],
            submission_data['name'],
            submission_data['email'],
            submission_data['company'],
            submission_data['project_type'],
            submission_data['budget'],
            submission_data['timeline'],
            submission_data['message'],
            submission_data['newsletter'],
            submission_data['ip_address'],
            submission_data['user_agent'],
            submission_data['referrer']
        ))
        
        conn.commit()
        conn.close()
        
        # Send notification emails
        notification_sent = send_notification_email(submission_data)
        auto_reply_sent = send_auto_reply(submission_data)
        
        # Handle newsletter signup
        if submission_data['newsletter']:
            try:
                conn = sqlite3.connect('portfolio.db')
                cursor = conn.cursor()
                
                # Generate unsubscribe token
                unsubscribe_token = hashlib.sha256(
                    f"{submission_data['email']}{datetime.utcnow()}".encode()
                ).hexdigest()
                
                cursor.execute('''
                    INSERT OR IGNORE INTO newsletter_subscribers (email, name, unsubscribe_token)
                    VALUES (?, ?, ?)
                ''', (submission_data['email'], submission_data['name'], unsubscribe_token))
                
                conn.commit()
                conn.close()
                
            except Exception as e:
                logger.error(f"Failed to add newsletter subscriber: {str(e)}")
        
        # Log analytics
        log_analytics_event('contact_form_submission', {
            'project_type': submission_data['project_type'],
            'budget': submission_data['budget'],
            'newsletter_signup': submission_data['newsletter']
        })
        
        response_data = {
            'success': True,
            'message': 'Your message has been sent successfully! I\'ll get back to you within 2 hours.',
            'submission_id': submission_data['submission_id']
        }
        
        # Add email status to response for debugging
        if not notification_sent or not auto_reply_sent:
            response_data['email_status'] = {
                'notification_sent': notification_sent,
                'auto_reply_sent': auto_reply_sent
            }
        
        return jsonify(response_data), 200
        
    except Exception as e:
        logger.error(f"Contact form error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'An error occurred while processing your request. Please try again.'
        }), 500

@app.route('/api/analytics', methods=['POST'])
@limiter.limit("10 per minute")
def track_analytics():
    """Track analytics events."""
    try:
        data = request.get_json()
        
        if not data or not data.get('event_type'):
            return jsonify({
                'success': False,
                'message': 'Event type is required'
            }), 400
        
        # Log the analytics event
        log_analytics_event(
            sanitize_input(data['event_type'], 50),
            data.get('event_data', {})
        )
        
        return jsonify({
            'success': True,
            'message': 'Analytics event recorded'
        }), 200
        
    except Exception as e:
        logger.error(f"Analytics error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to record analytics event'
        }), 500

@app.route('/api/newsletter/subscribe', methods=['POST'])
@limiter.limit("3 per minute")
def subscribe_newsletter():
    """Handle newsletter subscriptions."""
    try:
        data = request.get_json()
        
        if not data or not data.get('email'):
            return jsonify({
                'success': False,
                'message': 'Email is required'
            }), 400
        
        email = sanitize_input(data['email'], 255)
        name = sanitize_input(data.get('name', ''), 100)
        
        if not validate_email(email):
            return jsonify({
                'success': False,
                'message': 'Invalid email address format'
            }), 400
        
        # Generate unsubscribe token
        unsubscribe_token = hashlib.sha256(
            f"{email}{datetime.utcnow()}".encode()
        ).hexdigest()
        
        # Store in database
        conn = sqlite3.connect('portfolio.db')
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                INSERT INTO newsletter_subscribers (email, name, unsubscribe_token)
                VALUES (?, ?, ?)
            ''', (email, name, unsubscribe_token))
            
            conn.commit()
            
            # Log analytics
            log_analytics_event('newsletter_subscription', {'email': email})
            
            return jsonify({
                'success': True,
                'message': 'Successfully subscribed to newsletter!'
            }), 200
            
        except sqlite3.IntegrityError:
            return jsonify({
                'success': False,
                'message': 'Email already subscribed to newsletter'
            }), 409
        
        finally:
            conn.close()
        
    except Exception as e:
        logger.error(f"Newsletter subscription error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to subscribe to newsletter'
        }), 500

@app.route('/api/stats', methods=['GET'])
@limiter.limit("30 per minute")
def get_stats():
    """Get portfolio statistics."""
    try:
        conn = sqlite3.connect('portfolio.db')
        cursor = conn.cursor()
        
        # Get contact form submissions count (last 30 days)
        cursor.execute('''
            SELECT COUNT(*) FROM contact_submissions 
            WHERE timestamp > datetime('now', '-30 days')
        ''')
        recent_submissions = cursor.fetchone()[0]
        
        # Get total submissions
        cursor.execute('SELECT COUNT(*) FROM contact_submissions')
        total_submissions = cursor.fetchone()[0]
        
        # Get newsletter subscribers count
        cursor.execute('SELECT COUNT(*) FROM newsletter_subscribers WHERE status = "active"')
        newsletter_subscribers = cursor.fetchone()[0]
        
        # Get popular project types
        cursor.execute('''
            SELECT project_type, COUNT(*) as count 
            FROM contact_submissions 
            WHERE project_type IS NOT NULL AND project_type != ''
            GROUP BY project_type 
            ORDER BY count DESC 
            LIMIT 5
        ''')
        popular_project_types = [
            {'type': row[0], 'count': row[1]} 
            for row in cursor.fetchall()
        ]
        
        # Get analytics events count (last 7 days)
        cursor.execute('''
            SELECT COUNT(*) FROM analytics 
            WHERE timestamp > datetime('now', '-7 days')
        ''')
        recent_analytics_events = cursor.fetchone()[0]
        
        conn.close()
        
        return jsonify({
            'success': True,
            'stats': {
                'total_submissions': total_submissions,
                'recent_submissions': recent_submissions,
                'newsletter_subscribers': newsletter_subscribers,
                'recent_analytics_events': recent_analytics_events,
                'popular_project_types': popular_project_types,
                'last_updated': datetime.utcnow().isoformat()
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Stats error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to retrieve statistics'
        }), 500

@app.errorhandler(429)
def ratelimit_handler(e):
    """Handle rate limiting errors."""
    return jsonify({
        'success': False,
        'message': 'Rate limit exceeded. Please try again later.'
    }), 429

@app.errorhandler(404)
def not_found_handler(e):
    """Handle 404 errors."""
    return jsonify({
        'success': False,
        'message': 'Endpoint not found'
    }), 404

@app.errorhandler(500)
def internal_error_handler(e):
    """Handle 500 errors."""
    logger.error(f"Internal server error: {str(e)}")
    return jsonify({
        'success': False,
        'message': 'Internal server error'
    }), 500

if __name__ == '__main__':
    # Initialize database
    init_database()
    
    # Get configuration from environment
    host = os.getenv('HOST', '0.0.0.0')
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('DEBUG', 'False').lower() == 'true'
    
    logger.info(f"Starting Portfolio Backend Server on {host}:{port}")
    logger.info(f"Debug mode: {debug}")
    
    # Start the server
    app.run(
        host=host,
        port=port,
        debug=debug,
        threaded=True
    )

