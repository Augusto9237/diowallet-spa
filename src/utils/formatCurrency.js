export function formatCurrency(value){
  const formatedValue = value?.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return formatedValue;
}
