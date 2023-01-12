package com.sunnymix.flylint.api.model.wiki;

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
public class CreateWiki {

    @Builder.Default
    private Optional<String> catalogName = Optional.empty();

    @Builder.Default
    private Optional<String> type = Optional.empty();

}
