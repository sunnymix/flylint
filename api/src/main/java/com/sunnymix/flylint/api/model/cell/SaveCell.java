package com.sunnymix.flylint.api.model.cell;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Optional;

/**
 * @author sunnymix
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SaveCell {

    @Builder.Default
    private Optional<Integer> colSize = Optional.empty();

    @Builder.Default
    private Optional<Integer> rowSize = Optional.empty();

    @Builder.Default
    private Optional<Integer> width = Optional.empty();

    @Builder.Default
    private Optional<Integer> height = Optional.empty();

    @Builder.Default
    private Optional<String> content = Optional.empty();

}
