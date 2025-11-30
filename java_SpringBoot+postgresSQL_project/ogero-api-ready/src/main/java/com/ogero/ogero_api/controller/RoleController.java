package com.ogero.ogero_api.controller;

import com.ogero.ogero_api.model.Role;
import com.ogero.ogero_api.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleRepository roleRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Role> all() {
        return roleRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Role create(@RequestBody Role role) {
        return roleRepository.save(role);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Role get(@PathVariable Long id) {
        return roleRepository.findById(id).orElseThrow();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Role update(@PathVariable Long id, @RequestBody Role role) {
        Role existing = roleRepository.findById(id).orElseThrow();
        existing.setName(role.getName());
        existing.setParentRole(role.getParentRole());
        existing.setPermissions(role.getPermissions());
        return roleRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        roleRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
