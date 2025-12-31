import { fetchMQL5History } from "../src/services/common/mql5";

async function main() {
    const data = await fetchMQL5History(
        "https://www.mql5.com/en/economic-calendar/australia/commonwealth-bank-manufacturing-pmi"
    );
}

main();
