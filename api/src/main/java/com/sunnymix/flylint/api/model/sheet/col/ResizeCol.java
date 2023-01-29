package com.sunnymix.flylint.api.model.sheet.col;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author sunnymix
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResizeCol {

    private Integer col;

    private Integer width;

}
