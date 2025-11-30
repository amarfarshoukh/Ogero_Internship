package com.ogero.ogero_api.dto;

import lombok.Data;

import java.util.Set;

@Data
public class UserDto {
    private Long id;
    private String username;
    private String fullName;
    private boolean enabled;
    private Set<Long> roleIds;
}
