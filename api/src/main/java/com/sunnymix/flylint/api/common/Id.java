package com.sunnymix.flylint.api.common;

import java.util.Random;
import java.util.UUID;

/**
 * @author sunnymix
 */
public class Id {

    public static final int DEFAULT_LENGTH = 22;

    public static String newId() {
        return newId(DEFAULT_LENGTH);
    }

    public static String newId(int length) {
        int start = new Random().nextInt(32 - length);
        return UUID
                .randomUUID().toString().replace("-", "")
                .substring(start, start + length)
                .toLowerCase();
    }

}