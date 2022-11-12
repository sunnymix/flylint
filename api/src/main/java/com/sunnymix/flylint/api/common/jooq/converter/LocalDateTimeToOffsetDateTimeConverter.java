package com.sunnymix.flylint.api.common.jooq.converter;

import org.jooq.Converter;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

import static java.time.ZoneId.systemDefault;

/**
 * @author sunnymix
 */
public class LocalDateTimeToOffsetDateTimeConverter implements Converter<LocalDateTime, OffsetDateTime> {

    @Override
    public OffsetDateTime from(LocalDateTime ormObject) {
        if (ormObject == null) {
            return null;
        }
        return ormObject.atZone(systemDefault()).toOffsetDateTime();
    }

    @Override
    public LocalDateTime to(OffsetDateTime bizObject) {
        if (bizObject == null) {
            return null;
        }
        return bizObject.toLocalDateTime();
    }

    @Override
    public Class<LocalDateTime> fromType() {
        return LocalDateTime.class;
    }

    @Override
    public Class<OffsetDateTime> toType() {
        return OffsetDateTime.class;
    }

}
