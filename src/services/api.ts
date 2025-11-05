const API_BASE_URL = 'http://localhost:8080/api/v1/public';

/**
 * Fetches all public events.
 */
export async function fetchEventos() {
  console.log('API Call: Fetching all events...');
  try {
    const response = await fetch(`${API_BASE_URL}/eventos`);
    if (!response.ok) {
      console.error(`API Error: Failed to fetch events. Status: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('API Success: Events fetched successfully.', data);
    return data;
  } catch (error) {
    console.error("Falha detalhada ao carregar eventos:", error);
    throw error;
  }
}

/**
 * Fetches the details for a single event, including its lots.
 * @param id The ID of the event.
 */
export async function fetchEventoDetalhes(id: string) {
  console.log(`API Call: Fetching details for event ID: ${id}...`);
  try {
    const response = await fetch(`${API_BASE_URL}/eventos/${id}`);
    if (!response.ok) {
      console.error(`API Error: Failed to fetch event details for ID ${id}. Status: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(`API Success: Event details for ID ${id} fetched successfully.`, data);
    return data;
  } catch (error) {
    console.error(`Falha detalhada ao carregar detalhes do evento ${id}:`, error);
    throw error;
  }
}
