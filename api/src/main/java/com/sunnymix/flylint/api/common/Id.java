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

    public static String randomFilename(String filename) {
        if (Strings.isEmpty(filename)) {
            return filename;
        }

        int dotIndex = filename.lastIndexOf(".");
        if (dotIndex < 0) {
            return filename;
        }

        var filenameWithoutExt = filename.substring(0, dotIndex);
        var ext = filename.substring(dotIndex);
        var filenameWithRandomId = String.format("%s-%s%s", filenameWithoutExt, Id.newId(), ext);
        return filenameWithRandomId;
    }

}