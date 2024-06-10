<?php
return [
    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Stripe, Mailgun, SparkPost and others. This file provides a sane
    | default location for this type of information, allowing packages
    | to have a conventional place to find your various credentials.
    |
    */
    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
    ],
    
    // We need to provide default values to validate types
'firebase' => [
    'database_url' => env('FIREBASE_DATABASE_URL', ''),
    'project_id' => env('FIREBASE_PROJECT_ID', 'vcat-326313'),
    'private_key_id' => env('FIREBASE_PRIVATE_KEY_ID', '1cceac43a46126a43c8147c96fafd50ee91a29ee'),
    // replacement needed to get a multiline private key from .env 
    'private_key' => str_replace("\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDSMB3lJZ2Q94dO\nc/x9K35oauvm7o+D2cK00nTL7tH5dE/p3PV8giKO1s3xnTV1KEYwOgSFEBh/7X4N\neyhv0OIMTrT/csRRaqaW0j5RGAwL9lsGtR5B9b83Iycd+Mjq+4BJXQ0WPuuoAska\ncnsNertPJZEqI1SfcgQ4Sr/SpT1LhCMsA4FlN4rjf2m9agnok/mmE6bDI8UhzMGY\nkT81Owa18N6b+A/WjVsRyqnZQH5BaO11nPZGyGxUCSF3r6E/qdlj/QgLzjkwlGZP\nmIYYSpQxUrByTlEe7HW6xuH02pzLNavywdTB1JgOyrC0a1N9JQP9rBDmLalH+kza\npfNe1kkZAgMBAAECggEAWmTZJohj2EmsBkB5kPdYmN2K8LkePY00YIG2O1JNOWQd\nTi154f8xj46v6T48FFOqw+jfsr42WyYvNOsHe/cwkCx1SPr5lS4x0OFAba3S2H4t\nrZfNGH7wqmzS0OACwJRDGsoK68tJm+r+xAICC80Bq0szwBSLuzrUt8Tl9FieINA+\np+ryIADo3sgVrHqyMwyXCj2WpcvZLjV/lUw86FY7bnUzg0yruUB9sWNc20TDHkps\nQvMa08BGXyMZw3GsJwU6fJJfrwdSC1jeNYwz6mHuJtpqCx6OB/8l/d4e5WKHy4Fk\nQ21dNzHcubC9qD2ROWnFYLu52msinlJQEpDIYFE/lQKBgQDrq4DzWP7E8ATclpkQ\nRG5wVdra7sZ8X5wDHMbHzstAWQEF0mH84eGMPPog5DCtjtvmanU4Rok5wPi9vuls\nR5g1D2g93akcCbwAdOot9pjnnDC0uBrU+9v6uRZbqGCKDJwOYVxBFEb2Oj60DeFF\ngmH7tXFafxveWy2CifdAMnCgzwKBgQDkUd+JG20XcfeCT4gGUGearBbRfBMa1c2d\npE+jIPqUvLgGH9zNTNPIM7GIc7UVSmbt1dXqt5VK8KPp/RBvgsBdL7AeI2+u8Yn0\nD4DMdZpO52+0xsHbbd56wt8fKuJ18nF4ryWAKbS5to9jy6ZVmRNtMB9eKVVgtxNX\nnjuqizdhlwKBgBJ4DlMD1nN4m+jtpHEx67XCBLTDoap9k6xqxOlDu4n/b6UVJ7i5\nuwNShAev2mC/oVwdW7JdVMPB67xzCbgCpFsEKhcvF+GqoaEniHKxsKn2A5smEnQ+\niK7NcoMcXvRyqIg3+RLgk+8YAXH65HyeCy++uHNvIq/6VUa1qTrOuSThAoGBAKKN\nU8umlhWiEyhYfSyZpBlvudMtNeDeJUS9zeEDQsQQVCgwGSClOQaJHzVZw6vDy+I6\nYtF4ILc4+kpF3KS3f0MZB5d9fS8dUi1LuFRYyiKxDUu0UiJqZ4IZKYdkHdUBZh4Y\n/GbxynSJ8C6JuAOrNzR+lWaRoPJ5hTDVO/+gnC5DAoGAa2aruJb6DKnvLJC2sZot\nvyUf7ATQyP+CjqakGOk4krG5Xqmz61mfkL5dcf3gJNyPCkuynIE2n9stvouNxENk\nbDeCsYxaXKH8ZT3YV8x8FL3L9BTlqJhj0R/HssnTWURCDd63aRfzjTcewi+HqdHp\np8Fa5hz04FRXXWBuR6ziOWk=", "\n", env('FIREBASE_PRIVATE_KEY', '')),
    'client_email' => env('FIREBASE_CLIENT_EMAIL', 'vcat-808@vcat-326313.iam.gserviceaccount.com'),
    'client_id' => env('FIREBASE_CLIENT_ID', '117550226180177118914'),
    'client_x509_cert_url' => env('FIREBASE_CLIENT_x509_CERT_URL', 'https://www.googleapis.com/robot/v1/metadata/x509/vcat-808%40vcat-326313.iam.gserviceaccount.com'),
]
];