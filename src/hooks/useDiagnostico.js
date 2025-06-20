import { storeToRefs } from "pinia";
import { diagnostico } from "../store/diagnostico";

const useDiagnostico = () => {
    const storeRef = storeToRefs(diagnostico());

    return {
        ...storeRef,
        onSubmit: diagnostico().onSubmit,

    }
}

export default useDiagnostico;