server {
	server_name xelene.ru www.xelene.ru;
	root /var/www/xelene.ru;
	index index.html index.htm index.nginx-debian.html index.php;
	client_max_body_size 40m;
	server_name xelene.ru www.xelene.ru;
	large_client_header_buffers 4 64k;
	
	location / {
		try_files $uri $uri/ =404;
	}
	location /conversbot/callback {
		proxy_pass http://localhost:50071/;
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection 'upgrade';
		proxy_set_header Host $host;
		proxy_cache_bypass $http_upgrade;
	}
	location /ya_alice {
		proxy_pass http://localhost:3002/;
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection 'upgrade';
		proxy_set_header Host $host;
		proxy_cache_bypass $http_upgrade;
	}
	location /vk_gid/backend/ {
		proxy_pass http://localhost:3000/;
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection 'upgrade';
		proxy_set_header Host $host;
		proxy_cache_bypass $http_upgrade;
	}
	location /volunteer_card/api/ {
		proxy_pass http://localhost:3005/;
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection 'upgrade';
		proxy_set_header Host $host;
		proxy_cache_bypass $http_upgrade;
	}
	
	location ~ \.php$ {
		fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
		fastcgi_index index.php;
		fastcgi_param DOCUMENT_ROOT var/www/xelene.ru;
		fastcgi_param SCRIPT_FILENAME var/www/xelene.ru$fastcgi_script_name;
		fastcgi_param PATH_TRANSLATED var/www/xelene.ru$fastcgi_script_name;
		include fastcgi_params;
		fastcgi_param QUERY_STRING $query_string;
		fastcgi_param REQUEST_METHOD $request_method;
		fastcgi_param CONTENT_TYPE $content_type;
		fastcgi_param CONTENT_LENGTH $content_length;
		fastcgi_intercept_errors on;
		fastcgi_ignore_client_abort off;
		fastcgi_connect_timeout 60;
		fastcgi_send_timeout 180;
		fastcgi_read_timeout 180;
		fastcgi_buffer_size 128k;
		fastcgi_buffers 4 256k;
		fastcgi_busy_buffers_size 256k;
		fastcgi_temp_file_write_size 256k;
	}
	location ~ /\.ht {
		deny all;
	}
	
	error_page 404 /errors/404.html;
	error_page 403 /errors/403.html;

    listen [::]:443 ssl ipv6only=on; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/xelene.ru/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/xelene.ru/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot


}
server {
	server_name minio-server.xelene.ru;
	server_name minio-server.xelene.ru;
	location / {
	
	proxy_set_header X-Real-IP $remote_addr;
	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	proxy_set_header X-Forwarded-Proto $scheme;
	proxy_set_header Host $http_host;
	proxy_connect_timeout 300;
	proxy_http_version 1.1;
	proxy_set_header Connection "";
	chunked_transfer_encoding off;
	proxy_pass https://localhost:8443;
	   
	}

    listen [::]:443 ssl; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/xelene.ru/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/xelene.ru/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}
server {
    if ($host = www.xelene.ru) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    if ($host = xelene.ru) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


	listen 80;
	listen [::]:80;
	server_name xelene.ru www.xelene.ru;
	server_name xelene.ru www.xelene.ru;
    return 404; # managed by Certbot




}
server {
    if ($host = minio-server.xelene.ru) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


	listen 80;
	listen [::]:80;
	server_name minio-server.xelene.ru;
	server_name minio-server.xelene.ru;
    return 404; # managed by Certbot


}