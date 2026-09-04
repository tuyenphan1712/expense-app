package com.tuyenphan.expenseapp.shared.security;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Resolves to the authenticated user's UUID, read from the JWT subject — never
 * from a client-supplied field. See docs/BE-PROJECT-RULES.md §Security.
 *
 * Usage: {@code void create(@CurrentUser UUID userId, ...)}
 */
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
public @interface CurrentUser {
}
