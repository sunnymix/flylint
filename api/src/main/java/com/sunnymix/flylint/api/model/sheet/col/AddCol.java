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
public class AddCol {

    private Integer afterCol;

    private Integer size;

    private Integer width;

}
