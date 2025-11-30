package com.ogero.ogero_api.config;

import com.ogero.ogero_api.model.Permission;
import com.ogero.ogero_api.model.Role;
import com.ogero.ogero_api.model.User;
import com.ogero.ogero_api.repository.PermissionRepository;
import com.ogero.ogero_api.repository.RoleRepository;
import com.ogero.ogero_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final PermissionRepository permissionRepository;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (permissionRepository.count() == 0) {
            Permission manageUsers = permissionRepository.save(
                    Permission.builder().name("MANAGE_USERS").build());
            Permission viewUsers = permissionRepository.save(
                    Permission.builder().name("VIEW_USERS").build());

            Role adminRole = Role.builder()
                    .name("ADMIN")
                    .permissions(Set.of(manageUsers, viewUsers))
                    .build();
            roleRepository.save(adminRole);

            if (!userRepository.existsByUsername("admin")) {
                User admin = User.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin123"))
                        .fullName("System Admin")
                        .enabled(true)
                        .roles(Set.of(adminRole))
                        .build();
                userRepository.save(admin);
            }
        }
    }
}
