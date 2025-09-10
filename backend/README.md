# Visitor Management Backend Setup

## Requirements
- PHP 7.4 or higher
- MySQL 5.7 or higher
- Apache/Nginx web server

## Installation Steps

### 1. Database Setup
```bash
# Login to MySQL
mysql -u root -p

# Run the database script
source database.sql
```

### 2. Configure Database Connection
Edit `api/config.php` and update these values:
```php
$host = 'localhost';        // Your MySQL host
$dbname = 'visitor_management';
$username = 'your_username'; // Your MySQL username
$password = 'your_password'; // Your MySQL password
```

### 3. Web Server Setup

#### For Apache:
1. Copy the `backend` folder to your web server directory (e.g., `/var/www/html/`)
2. Ensure Apache has read permissions
3. Create `.htaccess` file in the `api` directory:
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [QSA,L]

# Enable CORS
Header always set Access-Control-Allow-Origin "*"
Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
Header always set Access-Control-Allow-Headers "Content-Type"
```

#### For Nginx:
Add this to your server block:
```nginx
location /api/ {
    try_files $uri $uri/ /api/index.php?$query_string;
    
    # CORS headers
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
    add_header Access-Control-Allow-Headers "Content-Type";
}
```

### 4. Frontend Configuration
Update the API URL in your frontend code:
- Open `src/services/visitors.ts`
- Change `API_BASE_URL` to your domain: `http://your-domain.com/api`

### 5. Test the API
Visit these URLs to test:
- `http://your-domain.com/api/visitors.php` (should return JSON data)

## API Endpoints

### GET /api/visitors.php
Returns all visitors

### POST /api/visitors.php
Creates a new visitor
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "1234567890",
  "company": "ABC Corp",
  "person_to_meet": "Jane Smith",
  "department": "IT",
  "purpose": "Meeting"
}
```

### PUT /api/visitors.php
Updates visitor (for checkout)
```json
{
  "id": "visitor-id",
  "check_out_time": "2024-01-01T10:00:00Z",
  "status": "checked-out"
}
```

## Deployment on Port 80

### Using Apache:
1. Place files in `/var/www/html/`
2. Ensure Apache is running on port 80
3. Update your domain's DNS A record to point to your server IP

### Using Nginx:
1. Configure Nginx to listen on port 80
2. Set document root to your backend folder
3. Restart Nginx service

## Security Notes
- Change default MySQL credentials
- Use HTTPS in production
- Implement proper input validation
- Consider API rate limiting
- Use environment variables for sensitive data