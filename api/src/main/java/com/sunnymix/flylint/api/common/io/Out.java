package com.sunnymix.flylint.api.common.io;

import lombok.*;

import java.util.Optional;

/**
 * @author sunnymix
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Out<T> {

    @NonNull
    private Boolean success;

    private Page page;

    private T data;

    private String code;

    private String msg;

    public static <T> Out<T> of(Boolean success, Page page, T data, String code, String msg) {
        Out<T> out;
        out = new Out<>();
        out.setSuccess(success);
        out.setPage(page);
        out.setData(data);
        out.setCode(code);
        out.setMsg(msg);
        return out;
    }

    public static <T> Out<T> of(Optional<T> data) {
        return data
            .map(_data -> of(true, null, _data, null, null))
            .orElse(error());
    }

    public static <T> Out<T> of(Boolean success) {
        return of(success, null, null, null, null);
    }

    public static <T> Out<T> ok() {
        return of(true, null, null, null, null);
    }

    public static <T> Out<T> ok(T data) {
        return of(true, null, data, null, null);
    }

    public static <T> Out<T> ok(Optional<T> data) {
        return data
            .map(_data -> of(true, null, _data, null, null))
            .orElse(ok());
    }

    public static <T> Out<T> ok(Page page, T data) {
        return of(true, page, data, null, null);
    }

    public static <T> Out<T> error() {
        return of(false, null, null, null, null);
    }

    public static <T> Out<T> error(String code, String msg) {
        return of(false, null, null, code, msg);
    }

}
