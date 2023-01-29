package com.sunnymix.flylint.api.model.sheet.row;

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
public class AddRow {

    private Integer afterRow;

    private Integer size;

    private Integer height;

}
