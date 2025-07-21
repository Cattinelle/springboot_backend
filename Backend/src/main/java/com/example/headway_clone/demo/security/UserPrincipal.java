package com.example.headway_clone.demo.security;

import com.example.headway_clone.demo.model.User;
import com.example.headway_clone.demo.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

public class UserPrincipal implements UserDetails {
    
    private UUID id;
    private String email;
    private String password;
    private Collection<? extends GrantedAuthority> authorities;
    private boolean isActive;
    
    public UserPrincipal(UUID id, String email, String password, 
                        Collection<? extends GrantedAuthority> authorities, boolean isActive) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
        this.isActive = isActive;
    }
    
    public static UserPrincipal create(User user) {
        List<GrantedAuthority> authorities = List.of(
            new SimpleGrantedAuthority("ROLE_USER")
        );
        
        return new UserPrincipal(
            user.getId(),
            user.getEmail(),
            user.getPassword(),
            authorities,
            user.getIsActive()
        );
    }
    
    public UUID getId() {
        return id;
    }
    
    @Override
    public String getUsername() {
        return email;
    }
    
    @Override
    public String getPassword() {
        return password;
    }
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
    
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    
    @Override
    public boolean isEnabled() {
        return isActive;
    }

    public User getUser(UserRepository userRepository) {
        return userRepository.findById(this.id).orElse(null);
    }
}

