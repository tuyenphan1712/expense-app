package com.tuyenphan.expenseapp.shared.common;

import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends ApiException {

    public ResourceNotFoundException(String code, String message) {
        super(code, HttpStatus.NOT_FOUND, message);
    }
}
