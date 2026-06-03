const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzJnb5479droeVA_qkIiD7lV0sxbjjAyDUpKOioTKSMIXmj9PI0hBeoDnLTuq8AAUjcZg/exec';

const callAppsScript = async (action, range, values = null) => {
  try {
    const payload = { action, range };
    if (values) payload.values = values;

    const response = await fetch(WEB_APP_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.status === 'error') {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    console.error(`Error in ${action} sheet data:`, error.message);
    throw error;
  }
};

const getSheetData = async (range) => {
  const data = await callAppsScript('get', range);
  return data.values || [];
};

const appendSheetData = async (range, values) => {
  return await callAppsScript('append', range, values);
};

const updateSheetData = async (range, values) => {
  return await callAppsScript('update', range, values);
};

const clearSheetData = async (range) => {
  await callAppsScript('clear', range);
  return true;
};

module.exports = {
  getSheetData,
  appendSheetData,
  updateSheetData,
  clearSheetData
};
