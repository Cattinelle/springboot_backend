package com.example.headway_clone.demo;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testRegisterAndLogin() throws Exception {
        // Use a unique email for each test run
        String email = "integrationtest+" + System.currentTimeMillis() + "@example.com";
        String password = "testpassword";
        String registerJson = "{" +
                "\"email\": \"" + email + "\"," +
                "\"password\": \"" + password + "\"," +
                "\"firstName\": \"Integration\"," +
                "\"lastName\": \"Test\"}";

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registerJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // Login
        String loginJson = "{" +
                "\"email\": \"" + email + "\"," +
                "\"password\": \"" + password + "\"}";

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.token").exists());
    }
} 