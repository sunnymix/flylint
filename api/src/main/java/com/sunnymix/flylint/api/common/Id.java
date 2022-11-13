package com.sunnymix.flylint.api.common;

import java.util.Random;
import java.util.UUID;

/**
 * @author sunnymix
 */
public class Id {

    public static final int SIZE = 22;

    public static String newId() {
        return newId(SIZE);
    }

    public static String newId(int size) {
        int start = new Random().nextInt(32 - size);
        return UUID
                .randomUUID().toString().replace("-", "")
                .substring(start, start + size)
                .toLowerCase();
    }

}