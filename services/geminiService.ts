import { GoogleGenAI, Type } from "@google/genai";
import { Expense, Material, Project } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeProjectHealth = async (
  project: Project,
  expenses: Expense[],
  materials: Material[]
) => {
  const modelId = "gemini-2.5-flash";

  // Prepare data summary for the prompt
  const expenseSummary = expenses.map(e => `${e.category}: R$${e.amount} (${e.description})`).join('\n');
  const materialSummary = materials.map(m => 
    `${m.name}: Usado ${m.quantityUsed}/${m.quantityTotal} ${m.unit} (Custo Médio: R$${m.costPerUnit})`
  ).join('\n');

  const prompt = `
    Atue como um auditor sênior de engenharia civil e gestor de obras. Analise os dados do projeto abaixo e forneça um relatório JSON estruturado.
    
    DADOS DO PROJETO:
    Nome: ${project.name}
    Orçamento Total: R$ ${project.budgetTotal}
    Gasto Atual: R$ ${project.budgetSpent}
    Progresso Físico: ${project.progress}%
    Status: ${project.status}

    DESPESAS RECENTES:
    ${expenseSummary}

    USO DE MATERIAIS:
    ${materialSummary}

    TAREFA:
    Analise a eficiência de custos, possíveis desperdícios de materiais e riscos de cronograma.
    Retorne a resposta EXATAMENTE no seguinte formato JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "Resumo executivo da saúde financeira e física da obra (máx 3 frases)." },
            risks: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING }, 
              description: "Lista de 3 riscos principais identificados." 
            },
            recommendations: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING }, 
              description: "3 ações corretivas recomendadas." 
            },
            savingsPotential: { type: Type.STRING, description: "Estimativa de onde economizar." }
          },
          required: ["summary", "risks", "recommendations", "savingsPotential"]
        }
      }
    });

    return JSON.parse(response.text || "{}");

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw new Error("Falha ao analisar o projeto com IA.");
  }
};