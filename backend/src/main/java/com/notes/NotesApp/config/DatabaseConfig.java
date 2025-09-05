// src/main/java/com/yourapp/config/DatabaseConfig.java
package com.notes.NotesApp.config;


import java.net.URI;

import javax.sql.DataSource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import com.zaxxer.hikari.HikariDataSource;

@Configuration
public class DatabaseConfig {

    @Bean
    public DataSource dataSource(Environment env) {
        HikariDataSource dataSource = new HikariDataSource();
        
        String dbUrl = env.getProperty("DATABASE_URL");
        
        if (dbUrl != null && dbUrl.startsWith("postgresql://")) {
            try {
                // Parse the Render database URL
                URI dbUri = new URI(dbUrl.replace("postgresql://", "http://"));
                
                String username = dbUri.getUserInfo().split(":")[0];
                String password = dbUri.getUserInfo().split(":")[1];
                String host = dbUri.getHost();
                int port = dbUri.getPort();
                String database = dbUri.getPath().substring(1);
                
                // Build proper JDBC URL
                String jdbcUrl = String.format("jdbc:postgresql://%s:%d/%s", host, port, database);
                
                dataSource.setJdbcUrl(jdbcUrl);
                dataSource.setUsername(username);
                dataSource.setPassword(password);
                
            } catch (Exception e) {
                throw new RuntimeException("Error parsing DATABASE_URL", e);
            }
        } else {
            // Fallback for local development
            dataSource.setJdbcUrl(env.getProperty("spring.datasource.url", 
                "jdbc:h2:mem:testdb"));
            dataSource.setUsername(env.getProperty("spring.datasource.username", "sa"));
            dataSource.setPassword(env.getProperty("spring.datasource.password", ""));
        }
        
        // Hikari connection pool settings
        dataSource.setMaximumPoolSize(5);
        dataSource.setConnectionTimeout(20000);
        dataSource.setIdleTimeout(300000);
        dataSource.setMaxLifetime(1800000);
        dataSource.setDataSourceClassName("org.postgresql.ds.PGSimpleDataSource");
        
        return dataSource;
    }
}