import { ParameterState } from "../common/parameter-state.enum";
export interface ParameterIndicador {
    //Este modelo se utilizara como indicador
    //para comparar el estado actual con el rango optimo
    name: string,
    optimalRange: string
    icon: string
    state: ParameterState

}
