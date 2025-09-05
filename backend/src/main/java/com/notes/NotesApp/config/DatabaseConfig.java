// src/main/java/com/yourapp/config/DatabaseConfig.java
package com.notes.NotesApp.config;


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
            // Convert Render format to JDBC format
            String jdbcUrl = "jdbc:" + dbUrl;
            dataSource.setJdbcUrl(jdbcUrl);
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
        
        return dataSource;
    }
}