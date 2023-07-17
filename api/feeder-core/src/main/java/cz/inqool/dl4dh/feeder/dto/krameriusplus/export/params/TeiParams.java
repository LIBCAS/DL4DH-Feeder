package cz.inqool.dl4dh.feeder.dto.krameriusplus.export.params;


import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode
public class TeiParams {

    private List<UdPipeParam> udPipeParams = new ArrayList<>();

    private List<NameTagParam> nameTagParams = new ArrayList<>();

    private List<AltoParam> altoParams = new ArrayList<>();
}
