package com.mytraveljournal.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        String uploadsPath = "C:/My Files/Software Projects/MyTravelJournal/project/backend/uploads/";
        System.out.println("Serving uploads from: " + uploadsPath);
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadsPath)
                .setCachePeriod(0);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/uploads/**")
            .allowedOriginPatterns("http://localhost:5173", "http://127.0.0.1:5173")
            .allowedMethods("GET", "HEAD")
            .allowedHeaders("*");
    }
}