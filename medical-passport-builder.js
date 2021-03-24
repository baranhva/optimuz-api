class Questionnaire {
    constructor(name, illnesses, questions) {
        this.name = name;
        this.illnesses = illnesses;
        this.questions = questions;
    }
}


class Question {
    constructor(question, type = "SCALE") {
        this.question = question;
        this.type = type;
    }
}

const tmp = await new QuestionnaireBuilder()
    .setName("First Questionnaire")
    .setIllnesses(["Astma"])
    .addQuestion("#01. Wat vind je van x?")
    .addQuestion("#02. Wat vind je van y?")
    .build();


class QuestionnaireBuilder {

    constructor() {
        this.questions = [];
    }

    setName(name) {
        this.name = name;
        return this;
    }

    setIllnesses(illnesses) {
        this.illnesses = illnesses;
        return this;
    }

    addQuestion(title, question, type) {
        this.questions.push({title, question, type});
        return this;
    }

    async build() {
        const transaction = await sequelize.transaction();

        try {
            const questions = await Promise.all(this.questions.map(({question, type}) => {
                return Question.create({
                    title: title, question: question, type: type
                }, {transaction: transaction});
            }));

            const questionIds = questions.map(question => question .id.toString());
            const questionnaire = await Questionnaire.create({
                name: this.name,
                illnesses: this.illnesses,
                questions: questionIds
            }, { transaction: transaction });

            await transaction.commit();
            return questionnaire;
        } catch (error) {
            await transaction.rollback();
        }
    }
}


class MedicalPassportBuilder {
    build() {

    }
}
