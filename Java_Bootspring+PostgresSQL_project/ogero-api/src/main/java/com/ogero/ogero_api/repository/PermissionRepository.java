package com.ogero.ogero_api.repository;

import com.ogero.ogero_api.model.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PermissionRepository extends JpaRepository<Permission, Long> {
}
