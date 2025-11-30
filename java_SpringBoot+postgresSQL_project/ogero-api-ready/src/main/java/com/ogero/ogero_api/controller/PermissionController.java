package com.ogero.ogero_api.controller;

import com.ogero.ogero_api.model.Permission;
import com.ogero.ogero_api.repository.PermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/permissions")
@RequiredArgsConstructor
public class PermissionController {

    private final PermissionRepository permissionRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Permission> all() {
        return permissionRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Permission create(@RequestBody Permission p) {
        return permissionRepository.save(p);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Permission get(@PathVariable Long id) {
        return permissionRepository.findById(id).orElseThrow();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Permission update(@PathVariable Long id,
                             @RequestBody Permission p) {
        Permission existing = permissionRepository.findById(id).orElseThrow();
        existing.setName(p.getName());
        return permissionRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        permissionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
