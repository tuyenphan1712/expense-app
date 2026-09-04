package com.tuyenphan.expenseapp.shared.util;

import java.time.LocalDate;
import java.time.YearMonth;

public final class DateUtils {

    private DateUtils() {
    }

    public static LocalDate today() {
        return LocalDate.now();
    }

    public static YearMonth currentPeriod() {
        return YearMonth.now();
    }
}
