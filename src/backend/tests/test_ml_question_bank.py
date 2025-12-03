import unittest
from unittest import mock

from routes.helpers import bkt_model, question_bank


class QuestionBankTests(unittest.TestCase):
    def test_build_question_bank_maps_all_questions(self):
        questions, skill_map, skill_ids = question_bank.build_question_bank(
            "python101", "ch1"
        )

        self.assertGreater(len(questions), 0, "chapter should contain questions")
        self.assertEqual(
            len(questions), len(skill_ids), "every question becomes a skill"
        )

        first_skill = skill_ids[0]
        self.assertTrue(
            first_skill.startswith("python101:ch1:"),
            "skill ids should include course and chapter prefixes",
        )
        self.assertIn(first_skill, skill_map)
        self.assertIn("question", skill_map[first_skill])


class BKTModelTests(unittest.TestCase):
    def setUp(self):
        # Reset tracker between tests
        self._orig_tracker = bkt_model._bkt_tracker
        bkt_model._bkt_tracker = None

    def tearDown(self):
        bkt_model._bkt_tracker = self._orig_tracker

    def test_update_mastery_monotonic(self):
        tracker = bkt_model.BKTTracker()
        initial = tracker.get_initial_mastery()
        history = [{"correct": False}, {"correct": True}, {"correct": True}]
        updated = tracker.update_mastery("student", "skill", history)
        self.assertGreaterEqual(updated, initial)
        self.assertLessEqual(updated, 1.0)

    def test_choose_next_skill_picks_lowest_mastery(self):
        mastery_state = {"s1": 0.2, "s2": 0.9}
        with mock.patch(
            "routes.helpers.bkt_model.load_student_model",
            return_value={"mastery": mastery_state, "bkt_history": {}},
        ):
            next_skill = bkt_model.choose_next_skill("user", ["s1", "s2"])
            self.assertEqual(next_skill, "s1")

    def test_record_attempt_updates_history_and_mastery(self):
        model_store = {"mastery": {}, "bkt_history": {}}

        def fake_load(_student_id):
            # Always return a copy so the function under test mutates its own data
            return {
                "mastery": dict(model_store["mastery"]),
                "bkt_history": dict(model_store["bkt_history"]),
            }

        def fake_save(_student_id, data):
            model_store["mastery"] = data["mastery"]
            model_store["bkt_history"] = data["bkt_history"]

        with (
            mock.patch(
                "routes.helpers.bkt_model.load_student_model", side_effect=fake_load
            ),
            mock.patch(
                "routes.helpers.bkt_model.save_student_model", side_effect=fake_save
            ),
        ):
            result = bkt_model.record_attempt("u1", "skill-x", True)

        self.assertIn("skill-x", model_store["mastery"])
        self.assertIn("skill-x", model_store["bkt_history"])
        self.assertGreaterEqual(
            result["new_mastery"], bkt_model.get_bkt_tracker().get_initial_mastery()
        )

    def test_record_attempt_applies_correct_and_wrong_updates(self):
        model_store = {"mastery": {}, "bkt_history": {}}

        def fake_load(_student_id):
            return {
                "mastery": dict(model_store["mastery"]),
                "bkt_history": dict(model_store["bkt_history"]),
            }

        def fake_save(_student_id, data):
            model_store["mastery"] = data["mastery"]
            model_store["bkt_history"] = data["bkt_history"]

        fake_tracker = mock.Mock(
            get_initial_mastery=mock.Mock(return_value=0.05),
            update_mastery=mock.Mock(side_effect=[0.2, 0.06]),
            get_mastery_threshold=mock.Mock(return_value=0.8),
        )

        with (
            mock.patch(
                "routes.helpers.bkt_model.load_student_model", side_effect=fake_load
            ),
            mock.patch(
                "routes.helpers.bkt_model.save_student_model", side_effect=fake_save
            ),
            mock.patch(
                "routes.helpers.bkt_model.get_bkt_tracker", return_value=fake_tracker
            ),
        ):
            bkt_model.record_attempt("u1", "skill-y", True)
            bkt_model.record_attempt("u1", "skill-y", False)

        self.assertEqual(model_store["mastery"]["skill-y"], 0.06)
        self.assertEqual(len(model_store["bkt_history"]["skill-y"]), 2)
        fake_tracker.update_mastery.assert_called()


if __name__ == "__main__":
    unittest.main()
