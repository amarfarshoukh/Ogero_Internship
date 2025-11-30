package com.ogero.ogero_api.service;

import com.ogero.ogero_api.dto.UserDto;
import com.ogero.ogero_api.model.Role;
import com.ogero.ogero_api.model.User;
import com.ogero.ogero_api.repository.RoleRepository;
import com.ogero.ogero_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User findById(Long id) {
        return userRepository.findById(id).orElseThrow();
    }

    public User create(UserDto dto) {
        Set<Role> roles = dto.getRoleIds().stream()
                .map(id -> roleRepository.findById(id).orElseThrow())
                .collect(Collectors.toSet());

        User user = User.builder()
                .username(dto.getUsername())
                .password(passwordEncoder.encode("123456")) // default password
                .fullName(dto.getFullName())
                .enabled(dto.isEnabled())
                .roles(roles)
                .build();

        return userRepository.save(user);
    }

    public User update(Long id, UserDto dto) {
        User existing = findById(id);
        existing.setFullName(dto.getFullName());
        existing.setEnabled(dto.isEnabled());

        if (dto.getRoleIds() != null) {
            Set<Role> roles = dto.getRoleIds().stream()
                    .map(rid -> roleRepository.findById(rid).orElseThrow())
                    .collect(Collectors.toSet());
            existing.setRoles(roles);
        }

        return userRepository.save(existing);
    }

    public void delete(Long id) {
        userRepository.deleteById(id);
    }
}
