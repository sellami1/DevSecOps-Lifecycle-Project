Vagrant.configure("2") do |config|
  config.vm.box = "alvistack/debian-12"
  config.vm.box_check_update = false
  config.vm.hostname = "activity4-portfolio"
  config.vm.define "activity4-portfolio"

  config.vm.network "forwarded_port", guest: 3000, host: 3000, host_ip: "127.0.0.1", auto_correct: true
  config.vm.network "forwarded_port", guest: 4000, host: 4000, host_ip: "127.0.0.1", auto_correct: true

  config.vm.provider "libvirt" do |libvirt|
    libvirt.memory = 4096
    libvirt.cpus = 2
  end

  config.vm.provision "ansible" do |ansible|
    ansible.playbook = "ansible/playbooks/deploy-portfolio.yml"
    ansible.compatibility_mode = "2.0"
    ansible.extra_vars = {
      ansible_python_interpreter: "/usr/bin/python3",
      api_bind_address: "0.0.0.0"
    }
  end
end
