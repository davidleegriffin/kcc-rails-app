const Appointment = {
  initialize() {
    $(document).on('turbolinks:load', () => {
      $('.not-accepting-volunteers').click(function (ev) {
        Appointment.notAcceptingVolunteers(this, ev);
      });

      $('.volunteer-with-skills').click(function (ev) {
        Appointment.volunteerWithSkills(this, ev);
      });

      $('.volunteer-without-skills').click(function (ev) {
        Appointment.volunteerWithoutSkills(this, ev);
      });
    });
  },

  notAcceptingVolunteers(that, ev) {
    ev.preventDefault();
    ev.stopPropagation();

    const targetHref = $(that).attr('href');

    const headerHTML = I18n.t('this_appointment_is_not_accepting_volunteers');
    const bodyHTML = I18n.t('we_re_sorry_this_appointment_has_indicated_no_volunteers');

    Covid.showModal(headerHTML, bodyHTML, [{ type: 'cancel', text: 'OK' }], 'warning');

    return false;
  },

  volunteerWithSkills(that, ev) {
    ev.preventDefault();
    ev.stopPropagation();

    const targetHref = $(that).attr('href');
    const skillsRequired = $(that).attr('x-skills-required').split(', ');
    const appointmentName = $(that).attr('x-appointment-name');
    const orgStatus = $(that).attr('x-org-status');

    let forProfitAlert = '';
    if (orgStatus == "For-profit") {
      forProfitAlert = `
      <div class="mt-3 text-xs">
        The U.S. Department of Labor has indicated that volunteers should not provide services equivalent to that of an employee for <span class='text-orange-400'>for-profit</span> private sector employers.<br/><br/>
        Discuss with the appointment team before proceeding in volunteering.
      </div>
      `
    }

    const headerHTML = I18n.t('you_re_about_to_request');
    const bodyHTML = `
      ${I18n.t('appointment_is_looking_for', { appointment_name: appointmentName })}
      <br>
      ${Covid.skillBadges(skillsRequired, 'primary')}
      <br>
      ${I18n.t('are_you_sure_the_appointment_owner_will_be_alerted')}<br><br>
      ${I18n.t('optionally_you_can_also_send_them_a_note')}
      <br>
      <div class="mt-3">
        <label for="volunteer_note" class="sr-only">${I18n.t('volunteer_note')}</label>
        <div class="relative rounded-md shadow-sm">
          <input id="volunteer_note" class="form-input block w-full sm:text-sm sm:leading-5" placeholder="${I18n.t('in_one_sentence_why_are_you_interested')}" />
        </div>
      </div>

      ${forProfitAlert}
      `;

    const callback = () => {
      const volunteerNote = $("#volunteer_note").val();
      $.post(targetHref, { volunteer_note: volunteerNote });
    }

    Covid.showModal(headerHTML, bodyHTML, [{ type: 'cancel' }, { type: 'submit', text: I18n.t('volunteer'), callback }], 'warning');

    return false;
  },

  volunteerWithoutSkills(that, ev) {
    ev.preventDefault();
    ev.stopPropagation();

    const targetHref = $(that).attr('href');
    const skillsRequired = $(that).attr('x-skills-required');

    const headerHTML = I18n.t('you_re_missing_skills');
    const bodyHTML = I18n.t('skills_needed_do_not_match', { skills_required: skillsRequired });

    const callback = () => window.location.href = targetHref;
    Covid.showModal(headerHTML, bodyHTML, [{ type: 'cancel' }, { type: 'submit', text: I18n.t('edit_profile'), callback }], 'warning');

    return false;
  }
}

export default Appointment;
